from sqlalchemy.orm import Session

from .models import (
    Product,
    Customer,
    Order,
    OrderItem
)



# PRODUCT OPERATIONS


def create_product(db: Session, product):

    existing = db.query(Product).filter(
        Product.sku == product.sku
    ).first()

    if existing:
        raise ValueError("SKU already exists")

    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity
    )

    db.add(new_product)

    db.commit()

    db.refresh(new_product)

    return new_product


def fetch_all_products(db: Session):
    return db.query(Product).all()


def fetch_product_by_id(
    db: Session,
    product_id: int
):
    return db.query(Product).filter(
        Product.id == product_id
    ).first()


def update_existing_product(
    db: Session,
    product_id: int,
    payload
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return None

    product.name = payload.name
    product.sku = payload.sku
    product.price = payload.price
    product.quantity = payload.quantity

    db.commit()

    db.refresh(product)

    return product


def remove_product(
    db: Session,
    product_id: int
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return None

    db.delete(product)

    db.commit()

    return {
        "message": "Product deleted successfully"
    }



# CUSTOMER OPERATIONS


def create_customer(
    db: Session,
    customer
):

    existing = db.query(Customer).filter(
        Customer.email == customer.email
    ).first()

    if existing:
        raise ValueError("Email already exists")

    new_customer = Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(new_customer)

    db.commit()

    db.refresh(new_customer)

    return new_customer


def fetch_all_customers(
    db: Session
):
    return db.query(Customer).all()


def fetch_customer_by_id(
    db: Session,
    customer_id: int
):
    return db.query(Customer).filter(
        Customer.id == customer_id
    ).first()


def remove_customer(
    db: Session,
    customer_id: int
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        return None

    db.delete(customer)

    db.commit()

    return {
        "message": "Customer deleted successfully"
    }



# ORDER OPERATIONS


def create_order(
    db: Session,
    order_data
):

    customer = db.query(Customer).filter(
        Customer.id == order_data.customer_id
    ).first()

    if not customer:
        raise ValueError("Customer not found")

    order = Order(
        customer_id=order_data.customer_id,
        total_amount=0
    )

    db.add(order)

    db.flush()

    total_amount = 0

    for item in order_data.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise ValueError(
                f"Product {item.product_id} not found"
            )

        if product.quantity < item.quantity:
            raise ValueError(
                f"Insufficient stock for {product.name}"
            )

        line_total = float(product.price) * item.quantity

        total_amount += line_total

        product.quantity -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        )

        db.add(order_item)

    order.total_amount = total_amount

    db.commit()

    db.refresh(order)

    return order


def fetch_all_orders(
    db: Session
):
    return db.query(Order).all()


def fetch_order_by_id(
    db: Session,
    order_id: int
):
    return db.query(Order).filter(
        Order.id == order_id
    ).first()


def remove_order(
    db: Session,
    order_id: int
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        return None

    db.delete(order)

    db.commit()

    return {
        "message": "Order deleted successfully"
    }