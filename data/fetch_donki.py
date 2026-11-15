"""Fetch verified DONKI CME and SEP records into the static game archive."""

from __future__ import annotations

import json
import os
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import requests


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "data" / "events.json"
API_ROOT = "https://api.nasa.gov/DONKI"
START_DATE = date(2024, 5, 1)
END_DATE = date(2024, 5, 31)
SCENARIO_LENGTH = 7


def api_key() -> str:
    key = os.environ.get("NASA_API_KEY", "").strip()
    if key:
        return key

    env_file = ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            name, separator, value = stripped.partition("=")
            if separator and name.strip() == "NASA_API_KEY":
                key = value.strip().strip("\"'")
                if key:
                    return key

    raise RuntimeError(
        "NASA_API_KEY is missing. Set it in the local .env file or environment."
    )


def fetch_records(session: requests.Session, endpoint: str, key: str) -> list[dict[str, Any]]:
    response = session.get(
        f"{API_ROOT}/{endpoint}",
        params={
            "startDate": START_DATE.isoformat(),
            "endDate": END_DATE.isoformat(),
            "api_key": key,
        },
        timeout=(10, 60),
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as error:
        raise RuntimeError(
            f"DONKI {endpoint} request failed with HTTP {response.status_code}."
        ) from error

    payload = response.json()
    if not isinstance(payload, list) or not all(
        isinstance(item, dict) for item in payload
    ):
        raise RuntimeError(f"DONKI {endpoint} returned an unexpected response shape.")
    return payload


def normalize_record(record: dict[str, Any], kind: str) -> dict[str, Any]:
    if kind == "CME":
        event_id = record.get("activityID")
        event_time = record.get("startTime")
        title_fr = "Éjection de masse coronale DONKI"
        title_en = "DONKI coronal mass ejection"
        event_type = "cme"
    elif kind == "SEP":
        event_id = record.get("sepID")
        event_time = record.get("eventTime")
        title_fr = "Événement de particules solaires DONKI"
        title_en = "DONKI solar energetic particle event"
        event_type = "sep"
    else:
        raise ValueError(f"Unsupported DONKI event kind: {kind}")

    if not isinstance(event_id, str) or not isinstance(event_time, str):
        raise RuntimeError(f"DONKI {kind} record is missing its ID or event time.")
    try:
        event_date = datetime.fromisoformat(event_time.replace("Z", "+00:00")).date()
    except ValueError as error:
        raise RuntimeError(
            f"DONKI {kind} record {event_id} has an invalid event time."
        ) from error

    event: dict[str, Any] = {
        "id": event_id,
        "date": event_date.isoformat(),
        "type": event_type,
        "title_fr": f"{title_fr} · {event_date.isoformat()}",
        "title_en": f"{title_en} · {event_date.isoformat()}",
    }
    linked_events = record.get("linkedEvents")
    if linked_events is not None:
        if not isinstance(linked_events, list):
            raise RuntimeError(
                f"DONKI {kind} record {event_id} has invalid linkedEvents."
            )
        event["linkedEvents"] = [
            linked["activityID"]
            for linked in linked_events
            if isinstance(linked, dict)
            and isinstance(linked.get("activityID"), str)
        ]
    if kind == "SEP":
        event["hasSEP"] = True
    link = record.get("link")
    if isinstance(link, str):
        event["donkiUrl"] = link
    return event


def choose_scenario(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    event_dates = [date.fromisoformat(event["date"]) for event in events]
    latest_start = END_DATE - timedelta(days=SCENARIO_LENGTH - 1)
    window_starts = (
        START_DATE + timedelta(days=offset)
        for offset in range((latest_start - START_DATE).days + 1)
    )
    best_start = max(
        window_starts,
        key=lambda start: sum(
            start <= event_date < start + timedelta(days=SCENARIO_LENGTH)
            for event_date in event_dates
        ),
    )

    events_by_day: dict[date, list[str]] = {}
    for event in events:
        event_date = date.fromisoformat(event["date"])
        if best_start <= event_date < best_start + timedelta(days=SCENARIO_LENGTH):
            events_by_day.setdefault(event_date, []).append(event["id"])

    return [
        {
            "day": offset + 1,
            "date": (best_start + timedelta(days=offset)).isoformat(),
            "eventIds": events_by_day.get(best_start + timedelta(days=offset), []),
        }
        for offset in range(SCENARIO_LENGTH)
    ]


def main() -> None:
    key = api_key()
    with requests.Session() as session:
        records = [
            *(("CME", record) for record in fetch_records(session, "CME", key)),
            *(("SEP", record) for record in fetch_records(session, "SEP", key)),
        ]

    events = [normalize_record(record, kind) for kind, record in records]
    if not events:
        raise RuntimeError("DONKI returned no CME or SEP events for May 2024.")
    events.sort(key=lambda event: (event["date"], event["id"]))

    archive = {
        "meta": {
            "source": "NASA DONKI CME and SEP archives",
            "retrieved": datetime.now(timezone.utc).date().isoformat(),
            "mode": "archive",
            "notes": (
                "Event records are archived DONKI CME and SEP data. "
                "CME arrival timing uses the declared game-balance delay, not a "
                "NASA Mars-arrival forecast. Other game effects are simplified."
            ),
        },
        "events": events,
        "scenario": {
            "titleKey": "storyMay2024",
            "days": choose_scenario(events),
        },
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(archive, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {len(events)} archived DONKI events to "
        f"{OUTPUT.relative_to(ROOT)}."
    )


if __name__ == "__main__":
    main()
