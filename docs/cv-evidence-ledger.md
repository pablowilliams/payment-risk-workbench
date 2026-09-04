# CV and interview evidence ledger

Use claims that can be opened, rerun and challenged.

| CV claim                                                         | Repository evidence                                    | Honest interview qualification                         |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| Built a capacity-aware fraud evaluation over one million events  | `analytics/backtest.py`, JSON evidence, validator      | synthetic fixed-seed holdout, not bank production data |
| Improved recall by 8.2 percentage points at equal queue capacity | comparison table and validation tests                  | uplift against this synthetic tabular challenger       |
| Increased labelled-exposure capture by 38.2 points               | model output and evaluation note                       | detected synthetic exposure, not recovered cash        |
| Designed human-authorised decision controls                      | decision API, exact-hash test, ADR 0001                | portfolio control pattern, no live customer action     |
| Designed replayable streaming and graph architecture             | AsyncAPI, architecture document, Compose and Terraform | local components plus AWS target design                |
| Delivered a senior operational interface                         | seven working views and responsive design              | fixtures represent a plausible operating state         |
| Established delivery governance                                  | NFR matrix, system card, threat model, runbooks and CI | production validation gates remain explicitly open     |

Suggested CV bullet: “Designed and built Payment Risk Workbench, a human-authorised financial-crime investigation platform; evaluated rules, tabular and graph detection over 1.0m fixed-seed synthetic payments, where the graph ensemble improved recall by 8.2pp at the same 1% alert budget, with reproducible tests, event/API contracts and AWS IaC.”
