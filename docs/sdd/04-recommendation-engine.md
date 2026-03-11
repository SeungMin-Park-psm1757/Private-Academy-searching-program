# Recommendation Engine

## Core Principle

LLM is the interpreter and explainer. The backend is the judge.

## Pipeline

1. Collect typed filters and one optional free-text message.
2. Parse free text into structured JSON.
3. Apply hard filters for launch region, publication state, subject, grade band,
   and commute radius.
4. Query candidate classes and schedules.
5. Evaluate schedule compatibility.
6. Evaluate seat status and minimum open threshold.
7. Score and sort.
8. Save Top 20 internally and return Top 3 publicly.
9. Generate reason and warning text from reason codes.

## Structured Requirement Example

```json
{
  "regionCode": "seoul-gangnam",
  "requestedLat": 37.5007,
  "requestedLng": 127.0473,
  "radiusMeters": 3000,
  "distanceBasis": "home",
  "subject": ["math"],
  "gradeBand": "middle-2",
  "budgetMinKrw": 200000,
  "budgetMaxKrw": 350000,
  "preferredWeekdays": [1, 3, 5],
  "preferredTimeWindow": {
    "startMinuteOfDay": 1140,
    "endMinuteOfDay": 1320
  },
  "needsShuttleSupport": true,
  "teachingStyles": ["concept-first", "small-group"]
}
```

## Scoring Weights

- Subject and grade fit: 30
- Schedule fit: 20
- Distance fit: 15
- Budget fit: 15
- Teaching style fit: 10
- Freshness and verification fit: 10
- Shuttle support: modifier bonus/penalty

## Required Policies

- Public result count is exactly Top 3
- Internal storage keeps Top 20 for analytics and later monetization
- Full classes or below-threshold classes become `waitlist_only`
- Stale data remains visible with a warning
- Distance can be evaluated from home or school basis
- Shuttle support must be reflected when parents require it
- Distance over limit is excluded by default, except when shuttle support is required and available
- If missing information blocks ranking quality, ask only one follow-up question
- Sponsored placement must be labeled if introduced later

## Suggested Reason Codes

- `SUBJECT_MATCH`
- `GRADE_MATCH`
- `SCHEDULE_MATCH`
- `DISTANCE_MATCH`
- `BUDGET_MATCH`
- `STYLE_MATCH`
- `VERIFIED_DATA`
- `SHUTTLE_SUPPORT`
- `WAITLIST_ONLY`
- `STALE_DATA_WARNING`
- `SELF_REPORTED_DATA`
- `NO_SHUTTLE_SUPPORT`

## Deterministic Ranking Outline

```text
score =
  subject_grade_fit +
  schedule_fit +
  distance_fit +
  budget_fit +
  teaching_style_fit +
  shuttle_fit +
  freshness_fit -
  penalties
```

## Result Policy

- Return Top 3
- Store Top 20 internally
- De-duplicate repeated branch results
- Prevent one brand from dominating the public list unfairly
- Return the selected distance basis and the evaluated distance in the result card
