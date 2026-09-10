import { Router } from "express";
import { createCustomerService } from "../services/customer.service";
import { CreateCustomerDto } from "../validations/customer.validations";
import { validateSync } from "class-validator";
import { Resource } from "../http/resource";

const router = Router();

router.post("/", async (req, res, next) => {
  const customerService = await createCustomerService();
  const validator = new CreateCustomerDto(req.body);
  const errors = validateSync(validator);

  if (errors.length > 0) {
    return res.send(errors);
  }

  const { name, email, password, phone, address } = req.body;
  try {
    const customer = await customerService.registerCustomer({
      name,
      email,
      password,
      phone,
      address,
    });

    const resource = new Resource(customer)
    next(resource);

  } catch (e) {
    return res.send((e as any).message);
  }
});

export default router;
