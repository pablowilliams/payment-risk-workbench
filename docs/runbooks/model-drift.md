# Runbook: model or feature drift

1. Validate the alert is not caused by a contract, pipeline or monitoring change.
2. Segment score and feature distributions by channel, region, customer tenure and relevant protected-proxy review cohorts.
3. Compare champion, challenger and rules baseline at the fixed alert budget.
4. If customer-outcome risk is material, freeze promotion or roll back to the last approved version.
5. Investigate label delay, attacker adaptation, population change, graph density and calibration separately.
6. Re-evaluate on a forward time window; document uncertainty and subgroup sample sizes.
7. Obtain model-risk and operations approval before staged release.
8. Monitor queue load, overturns, complaints and matured outcomes after restoration.
