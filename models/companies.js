const db = require('../db');
const ExpressError = require('../helpers/ExpressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class Company {
  constructor({ handle, name, num_employees, description, logo_url }) {
    this.handle = handle;
    this.name = name;
    this.num_employees = num_employees;
    this.description = description;
    this.logo_url = logo_url;
  }

  // find all companies
  static async findAll() {
    const results = await db.query(`SELECT handle, name FROM companies`);

    // since we're working on instacnes, we make each one & return it
    // , also could just 'return result.rows'
    return results.rows.map((company) => new Company(company));
  }

  // make a company object to handle as an instance
  static create(companyData) {
    const company = new Company(companyData);
    return company;
  }

  static async find(handle) {
    const result = await db.query(
      `SELECT name, num_employees, description, logo_url
                                    FROM companies
                                    WHERE handle = $1`,
      [handle]
    );

    const company = result.rows[0];

    if (company === undefined) {
      const error = new ExpressError(`No company found with handle: ${handle}`);
      error.status = 404;
      throw error;
    }

    return new Company(company);
  }

  // create a new company
  async add() {
    try {
      await db.query(
        `INSERT INTO companies (handle, name, num_employees, description, logo_url)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING *`,
        [this.handle, this.name, this.num_employees, this.description, this.logo_url]
      );
    } catch (error) {
      return new ExpressError(error);
    }
  }
}

module.exports = Company;