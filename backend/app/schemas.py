from pydantic import BaseModel, Field
from typing import List


class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)


class ProductUpdate(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)


class CustomerCreate(BaseModel):
    full_name: str
    email: str
    phone: str


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True