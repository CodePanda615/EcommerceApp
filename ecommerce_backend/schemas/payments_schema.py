from pydantic import BaseModel
class PaymentSchema(BaseModel):
    order_id: int
    amount: float