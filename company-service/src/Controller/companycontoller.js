import companyValidationSchema from "../Model/companyvalidate.js";
import company from "../Model/companyModel.js";
import logger from "../Utils/logger.js";

const companyController = {
  createJob: async (req, res) => {
    try {
      const { error } = companyValidationSchema.validate(req.body);
      if (error) {
        logger.warn(`please proivide a company validation error field`);
        return res.status(400).json({ message: error.details[0].message });
      }
      const { companyName } = req.body;
      if (!companyName) {
        logger.warn(`please provide a company name`);
        return res.status(400).json({ message: "Company name is required" });
      }
      const existingCompany = await company.findOne({ companyName });
      if (existingCompany) {
        logger.warn(`company already exists`);
        return res.status(400).json({ message: "Company already exists" });
      }
      const newCompany = new company({
        companyName,
        userId: req.user.id,
      });
      await newCompany.save();
      logger.info(`Successfully created a new job for company ${companyName}`);
      return res.status(201).json({
        message: "Company job created successfully",
        success: true,
        newCompany,
      });
    } catch (error) {
      logger.error(`internal server error `);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default companyController;
