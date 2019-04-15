export function encodeQuery(obj) {
  const ret = [];
  for (let d in obj) {
    if (obj.hasOwnProperty(d) && obj[d]) {
      ret.push(encodeURIComponent(d) + ":" + encodeURIComponent(obj[d]));
    }
  }

  return ret.join(" ");
}

export function parseQueryStr(str) {
  const queries = decodeURIComponent(str);

  const hash = {};

  queries.split(" ").forEach((val, key) => {
    let q;
    if (key === 0) {
      if (!val) {
        return;
      }
      q = val.replace("?", "");
      q = q.split("=");
    } else {
      q = val.split(":");
    }
    hash[q[0]] = q[1];
  });
  return hash;
}

export function buildQuery({ q, stars, license, fork }) {
  let url = encodeQuery({ stars, license, fork });
  url = `q=${q} ${url}`;
  return url;
}

export function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
