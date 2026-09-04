# Evaluation protocol and results

## Question

At a fixed investigator capacity of 10,000 alerts across one million synthetic payment events, does graph augmentation find more labelled fraud than a calibrated tabular challenger, and what financial exposure does the ranking surface?

## Reproducible method

`analytics/backtest.py` streams the population with seed `7312026`. It creates four labelled fraud patterns and legitimate activity without writing the full population to disk. Each strategy retains only its top 10,000 scores through a bounded heap. This tests capacity-aware ranking rather than choosing a favourable score threshold after observing results.

The independent validator reconciles denominators, alert counts, segment totals, rank order, performance bounds, model ordering, trace coverage and disclosure text. Run `npm run backtest && npm run validate:backtest` to regenerate and validate the evidence.

## Headline synthetic results

| Strategy       | Precision | Recall | Labelled exposure captured | Alert budget |
| -------------- | --------: | -----: | -------------------------: | -----------: |
| Rules baseline |     80.0% |  54.0% |                      29.1% |       10,000 |
| Tabular model  |     84.0% |  56.7% |                      16.8% |       10,000 |
| Graph ensemble |     96.2% |  64.9% |                      55.0% |       10,000 |

Graph augmentation improves recall by 8.2 percentage points and synthetic labelled-exposure capture by 38.2 points versus the tabular challenger. The portfolio also models 5.82 ms P50 and 8.07 ms P95 scoring latency, 100% trace coverage and zero duplicate decisions.

## Claim boundary

All payments, labels, customers, exposure, latency and operating telemetry are synthetic or modelled. Exposure detected is not cash recovered. Offline labels are not live investigator outcomes. The evaluation is a reproducible engineering proof, not evidence of performance in a bank. A production decision requires time-based shadow validation, outcome maturation, subgroup review, security testing, load testing and formal model-risk approval.
