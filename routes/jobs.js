const Router = require('express').Router;
const router = new Router();
const Job = require('../models/jobs');
const ExpressError = require('../helpers/ExpressError');
const { validate } = require('jsonschema');
const { jobsNew } = require('../schemas');

// get all jobs
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (error) {
    return next(error);
  }
});

// get a specific job
router.get('/:id', async function (req, res, next) {
  try {
    const job = await Job.find(req.params.id);
    return res.json({ job });
  } catch (error) {
    return next(error);
  }
});

// create a job
router.post('/', async function (req, res, next) {
  try {
    // validate our json
    const validation = validate(req.body, jobsNew);
    if (!validation.valid) {
      // show our erros from the schema
      throw new ExpressError(
        validation.errors.map((el) => el.stack),
        404
      );
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (error) {
    return next(error);
  }
});

// update a job
router.patch('/:id', async function (req, res, next) {
  try {
    // disallow user from changing our primary key
    if ('id' in req.body) {
      throw new ExpressError(`You can't change a job's ID!`, 400);
    }

    const updatedJob = await Job.update(req.params.id, req.body);
    return res.json({ updatedJob });
  } catch (error) {
    return next(error);
  }
});

// delete a job
router.delete('/:id', async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ message: 'Job successfully deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
