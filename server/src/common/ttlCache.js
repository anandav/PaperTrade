const store = new Map();
const inflight = new Map();

function ttlMs() {
  const sec = Number(global.appConfig?.cacheDuration);
  return (sec > 0 ? sec : 60) * 1000;
}

async function getOrFetch(key, fetcher) {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.exp > now) {
    return hit.data;
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const pending = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      if (data != null) {
        store.set(key, { data, exp: Date.now() + ttlMs() });
      }
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, pending);
  return pending;
}

module.exports = { getOrFetch };
