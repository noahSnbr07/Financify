#  live-output logs

## syntax
`$ watch -n <interval_in_seconds> -d "cat logs/billing.log | head -n <lines>"`

## example
`$ watch -n 1 -d "cat logs/billing.log | head -n 64"`