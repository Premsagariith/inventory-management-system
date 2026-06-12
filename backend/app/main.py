from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from .database import engine, SessionLocal

from .models import (
    Base,
    Product,
    Customer,
    Order
)

from .schemas import (
    ProductCreate,
    ProductUpdate,
    CustomerCreate,
    OrderCreate
)

from .crud import (
    create_product,
    fetch_all_products,
    fetch_product_by_id,
    update_existing_product,
    remove_product,

    create_customer,
    fetch_all_customers,
    fetch_customer_by_id,
    remove_customer,

    create_order,
    fetch_all_orders,
    fetch_order_by_id,
    remove_order
)

app = FastAPI(
    title="Inventory Management API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://inventory-management-system-sigma-teal.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Inventory Management API Running"
    }



# PRODUCT ROUTES


@app.post("/products")
def add_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    try:
        return create_product(
            db,
            product
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    return fetch_all_products(db)


@app.get("/products/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = fetch_product_by_id(
        db,
        product_id
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db)
):

    updated_product = update_existing_product(
        db,
        product_id,
        payload
    )

    if not updated_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return updated_product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    deleted_product = remove_product(
        db,
        product_id
    )

    if not deleted_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return deleted_product



# CUSTOMER ROUTES


@app.post("/customers")
def add_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    try:
        return create_customer(
            db,
            customer
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@app.get("/customers")
def get_customers(
    db: Session = Depends(get_db)
):
    return fetch_all_customers(db)


@app.get("/customers/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = fetch_customer_by_id(
        db,
        customer_id
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


@app.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    deleted_customer = remove_customer(
        db,
        customer_id
    )

    if not deleted_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return deleted_customer



# ORDER ROUTES

@app.post("/orders")
def place_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):

    try:
        return create_order(
            db,
            order
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@app.get("/orders")
def get_orders(
    db: Session = Depends(get_db)
):
    return fetch_all_orders(db)


@app.get("/orders/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = fetch_order_by_id(
        db,
        order_id
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@app.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    deleted_order = remove_order(
        db,
        order_id
    )

    if not deleted_order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return deleted_order


@app.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db)
):

    total_products = db.query(Product).count()

    total_customers = db.query(Customer).count()

    total_orders = db.query(Order).count()

    low_stock_products = (
        db.query(Product)
        .filter(Product.quantity < 5)
        .all()
    )

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": [
            {
                "id": product.id,
                "name": product.name,
                "quantity": product.quantity
            }
            for product in low_stock_products
        ]
    }