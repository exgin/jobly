const db = require('../db');
const ExpressError = require('../helpers/ExpressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const { query } = require('../db');

// using a different approach, rather than a constructor, like how i did with the Company model
class Job {
  // find all jobs | can filter based on a query search
  static async findAll(data) {
    let baseQuery = `SELECT id, title, company_handle FROM jobs`;
    let whereExpressions = [];

    // our [id, title, company_handle]
    let queryValues = [];

    // a filtered list of titles & company handles on the search term
    if (data.search) {
      queryValues.push(`%${data.search}`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    // use our query string value we get from the request query string
    if (data.min_salary) {
      // '+data.min_employees', the + makes sure we return a numeric value
      queryValues.push(+data.min_employees);
      // we're setting the '$1, $2, $3, ..etc' to the query length value
      whereExpressions.push(`min_salary >= $${queryValues.length}`);
    }

    if (data.min_equity) {
      queryValues.push(+data.min_employees);
      whereExpressions.push(`min_equity >= $${queryValues.length}`);
    }

    // we add the 'WHERE' statement to our whereExpressions | this helps if there is nothing in the
    // -> req query, we'll completly ignore the rest of the statements
    if (whereExpressions.length > 0) {
      baseQuery += ' WHERE ';
    }

    let PSQLquery = baseQuery + whereExpressions.join(' AND ');
    // pass in our query & it's values
    const result = await db.query(PSQLquery, queryValues);

    return result.rows;
  }
}

module.exports = Job;
