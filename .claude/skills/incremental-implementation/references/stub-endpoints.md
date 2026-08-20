# Handling Stub/Placeholder Endpoints During Incremental Implementation

## The Problem
During a migration or refactor, some endpoints may have been left as stubs returning hardcoded values (zeros, empty arrays, null) instead of connecting to real data sources.

## Detection Pattern
```bash
# If one endpoint returns real data but a related endpoint returns zeros
curl /api/executions    # Returns 14 real execution records
curl /api/metrics       # Returns {"total":0,"taxaSucesso":0,"custoTotal":0}
```

## Incremental Fix Approach

### Slice 1: Verify the data source exists
```bash
# Check if the service layer has the needed methods
grep -n "getCosts\|listExecutions" src/services/config.js
```

### Slice 2: Connect the endpoint to the service
```javascript
// Before (stub)
const metrics = { total: 0, taxaSucesso: 0, custoTotal: 0 };

// After (real data)
const executions = await configService.listExecutions(1000);
const costs = await configService.getCosts('mes');
const total = executions.length;
const successCount = executions.filter(e => e.status === 'success' || e.status === 'concluido').length;
const taxaSucesso = total > 0 ? Math.round((successCount / total) * 100) : 0;
const custoTotal = costs.reduce((sum, c) => sum + (c.custo || 0), 0);
```

### Slice 3: Verify with existing test suite
```bash
npm test  # Should pass - no new tests needed if service methods already tested
```

## Key Principle
Don't leave stubs in place "for now." They become technical debt that looks like bugs to users. Each increment should either:
1. Implement real functionality, OR
2. Be behind a feature flag with clear documentation that it's a placeholder

## Verification
- [ ] Related endpoint returns real data
- [ ] All existing tests pass
- [ ] No new "zero" responses for endpoints that should have data