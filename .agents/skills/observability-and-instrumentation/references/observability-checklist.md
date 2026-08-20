# Observability Checklist

## Pre-launch Instrumentation Gate

- [ ] The on-call questions for this feature are written down, and each signal maps to one
- [ ] All log output is structured (JSON), with stable event names and a correlation ID on every line
- [ ] No secrets, tokens, or unredacted PII in any log line (spot-check actual output)
- [ ] RED metrics exist for every new endpoint and every external dependency, with bounded label sets
- [ ] Latency is a histogram; p95/p99 are queryable
- [ ] A single request can be followed end-to-end in the tracing UI without broken spans
- [ ] Every new alert is symptom-based, has a runbook link, and was test-fired once
- [ ] An induced failure in staging was located via telemetry alone, without reading the source

---

## API/Middleware Auth Considerations

When instrumenting API endpoints that use authentication middleware:

### Metrics Endpoints

The One.Shot.Play application uses an auth middleware that requires `API_KEY` to be set:

```javascript
// auth middleware behavior:
// 1. If API_KEY env var is NOT set → auth is BYPASSED (no authentication required)
// 2. If API_KEY env var IS set → requests MUST include valid x-api-key header
```

**Common gotchas:**
- Testing metrics endpoints locally often fails with 401 when API_KEY is configured
- Set `API_KEY=` (empty or unset) in .env for development, or use valid key for testing
- The Dashboard UI fetches from same origin, so it inherits the server's API key requirements

### Testing Unauthenticated Access

For local development/testing:

1. **Development mode:** Set `API_KEY=` in `.env` to bypass auth
2. **With auth:** Use `curl -H "x-api-key: your-key" http://localhost:3456/api/metrics`
3. **Browser testing:** The browser will work if the server allows (same-origin request)