from models.products import Product

class Productservice: 
    def getProducts(db):        
        products = db.query(Product).all()
        return products
    def addProduct(db,request):
        new_product = Product(

            product_name=request.product_name,

            product_variant=request.product_variant
        )

        db.add(new_product)

        db.commit()

        db.refresh(new_product)

        return {
            "message": "Product added successfully"
        }

        