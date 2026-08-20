# Debugging Frontend-Backend Disconnect (Session Reference)

## Scenario
Frontend loads but "nothing works" - no data loads, buttons don't respond, all API calls appear to fail silently.

## Root Causes Found in This Session

### 1. Missing API_KEY in .env
- **Symptom**: All API calls return 401 Unauthorized
- **Cause**: Auth middleware requires `x-api-key` header, but `process.env.API_KEY` was undefined (no .env file)
- **Fix**: Create `.env` with `API_KEY=dev_key_123`
- **Detection**: Test `/api/execute` with curl - returns `{"error":{"code":"UNAUTHORIZED","message":"API key inválida ou ausente"}}`

### 2. Stub Endpoints Returning Zeros
- **Symptom**: Dashboard shows "0" for all metrics despite data existing in DB
- **Cause**: `/api/metrics` endpoint had hardcoded `total: 0, taxaSucesso: 0, custoTotal: 0`
- **Fix**: Connect to `ConfigService.listExecutions()` and `ConfigService.getCosts()` for real data
- **Detection**: `curl /api/metrics` returns zeros while `/api/executions` returns real data

### 3. Server Not Running / Port Mismatch
- **Symptom**: `curl` returns "Failed to connect to localhost port 3456"
- **Cause**: Server process died or running on different port
- **Fix**: Restart with `cd /d/Github/One.Shot.Play && node index.js`
- **Detection**: Check process status with `ps aux | grep node`

## Reproduction Checklist
```bash
# 1. Verify server is running
curl -i http://localhost:3456/api/health

# 2. Test auth (should fail without .env)
curl -i http://localhost:3456/api/execute -X POST -H "Content-Type: application/json" -d '{}'

# 3. Test with API key (once .env exists)
curl -i http://localhost:3456/api/execute -X POST -H "Content-Type: application/json" -H "x-api-key: dev_key_123" -d '{}'

# 4. Verify data endpoints
curl http://localhost:3456/api/executions -H "x-api-key: dev_key_123"
curl http://localhost:3456/api/metrics -H "x-api-key: dev_key_123"
```

## Key Lesson
When frontend appears "disconnected" from backend:
1. **Test backend directly with curl first** - don't assume frontend is the problem
2. **Check for missing .env** - auth middleware often fails silently without it
3. **Compare stub vs real endpoints** - if one endpoint has real data and another has zeros, the zeros are likely a bug
4. **Verify server process is alive** - background processes can die silently