const faunadb = require('faunadb'),
  q = faunadb.query


const storeStats = (secret, collection, stats) => {
  const client = new faunadb.Client({ secret: secret })
  client.query(
    q.Create(
      q.Collection(collection),
      { data:  stats }
    )
  )

}

exports.handler = async (event, context) => {
  /* Check method */
  const cors_headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
  }

  switch (event.httpMethod) {
    case 'OPTIONS':
      return {
        statusCode: 200,
        headers: cors_headers,
        body: ''
      }
    case 'POST':
      const stats = JSON.parse(event.body);
      storeStats(process.env['FAUNADB_SERVER_SECRET'], 'stats', stats)
      return {
        statusCode: 200,
        headers: cors_headers,
        body: ''
      }

    default:
      return { statusCode: 405, body: 'unsupported method' }
  }

}
