export default async function eachLimit(collection, limit, iterator, done) {
  const len = collection.length;

  try {
    for (let i = 0; i < len; i += limit) {
      await Promise.all(collection.slice(i, i + limit).map(iterator));
    }
    done();
  } catch (e) {
    done(e);
  }

};
