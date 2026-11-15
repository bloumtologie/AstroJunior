import unittest
from unittest.mock import Mock

import requests

from data.fetch_donki import choose_scenario, fetch_records, normalize_record


class NormalizeRecordTests(unittest.TestCase):
    def test_normalizes_cme_detection_without_claiming_same_day_arrival(self):
        event = normalize_record(
            {
                "activityID": "2024-05-09T08:45:00-CME-001",
                "startTime": "2024-05-09T08:45Z",
                "link": "https://ccmc.gsfc.nasa.gov/DONKI/view/CME/1/-1",
                "linkedEvents": [{"activityID": "2024-05-09T08:45:00-FLR-001"}],
            },
            "CME",
        )

        self.assertEqual(event["type"], "cme")
        self.assertEqual(event["date"], "2024-05-09")
        self.assertEqual(event["linkedEvents"], ["2024-05-09T08:45:00-FLR-001"])
        self.assertNotIn("hasCME", event)
        self.assertNotIn("cmeDelayDays", event)

    def test_normalizes_sep_and_accepts_absent_linked_events(self):
        event = normalize_record(
            {
                "sepID": "2024-05-09T13:59:00-SEP-001",
                "eventTime": "2024-05-09T13:59Z",
                "linkedEvents": None,
            },
            "SEP",
        )

        self.assertEqual(event["type"], "sep")
        self.assertTrue(event["hasSEP"])
        self.assertNotIn("linkedEvents", event)

    def test_rejects_unknown_event_kind(self):
        with self.assertRaisesRegex(ValueError, "Unsupported DONKI event kind"):
            normalize_record({}, "FLR")


class ScenarioTests(unittest.TestCase):
    def test_selects_seven_consecutive_days_and_only_links_in_window(self):
        events = [
            {"id": "early-a", "date": "2024-05-09"},
            {"id": "early-b", "date": "2024-05-10"},
            {"id": "early-c", "date": "2024-05-11"},
            {"id": "late-a", "date": "2024-05-25"},
            {"id": "late-b", "date": "2024-05-26"},
            {"id": "outside", "date": "2024-05-01"},
        ]

        days = choose_scenario(events)

        self.assertEqual(len(days), 7)
        self.assertEqual(days[0]["date"], "2024-05-05")
        self.assertEqual(days[-1]["date"], "2024-05-11")
        self.assertEqual(
            [day["eventIds"] for day in days],
            [[], [], [], [], ["early-a"], ["early-b"], ["early-c"]],
        )

    def test_selects_the_first_window_with_the_highest_event_count(self):
        events = [
            {"id": "first-a", "date": "2024-05-09"},
            {"id": "first-b", "date": "2024-05-10"},
            {"id": "second-a", "date": "2024-05-20"},
            {"id": "second-b", "date": "2024-05-21"},
        ]

        days = choose_scenario(events)

        self.assertEqual(days[0]["date"], "2024-05-04")
        self.assertEqual(
            [day["eventIds"] for day in days],
            [[], [], [], [], [], ["first-a"], ["first-b"]],
        )


class FetchTests(unittest.TestCase):
    def test_network_errors_do_not_echo_the_api_key(self):
        session = Mock()
        session.get.side_effect = requests.ConnectionError(
            "connection failed for https://api.nasa.gov/?api_key=secret-value"
        )

        with self.assertRaises(RuntimeError) as raised:
            fetch_records(session, "CME", "secret-value")

        self.assertIn("check network access and API key", str(raised.exception))
        self.assertNotIn("secret-value", str(raised.exception))


if __name__ == "__main__":
    unittest.main()
