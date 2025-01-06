const path = require('path')
const productModel = require('../models/productModel')
const fs = require('fs')
const createProduct = async (req, res) => {

    // checkk incomming data 
    console.log(req.body)
    console.log(req.files)

    // destructuring the body data (json)
    const { productName, productCategory } = req.body;

    // Validation
    if (!productName || !productCategory) {
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }



    // save to database
    const newProduct = new productModel({
        productName: productName,

        productCategory: productCategory,

    })

    const product = await newProduct.save()
    res.status(201).json({
        "success": true,
        "message": "Product created successfully",
        "data": product
    })





};
// fetch all products
const getAllProducts = async (req, res) => {
    // try catch
    try {
        const allProducts = await productModel.find({})
        res.status(201).json({
            "success": true,
            "message": "Product fetched successfully",
            "product": allProducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": " Internal Server Error",
            "error": error
        })

    }

    // fetch all products
    // send response

}

// fetch single product 
const getSingleProduct = async (req, res) => {
    // get product id form url (params)
    const productId = req.params.id;
    // find 
    try {
        const product = await productModel.findById(productId)
        if (!product) {
            res.status(400).json({
                "success": false,
                "message": "no product found"
            })
        }

        res.status(201).json({
            "success": true,
            "message": "product fetched ",
            "product": product
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": " Internal Server Error",
            "error": error
        })

    }



}

// delete product 
const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id)
        res.status(201).json({
            "success": true,
            "message": "product deleted successfully",
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "internal server error",
            "error": error
        })
    }
}



const updateProduct = async (req, res) => {
    try {

        if (req.files) {

        }
        // Update the data
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).json({
            success: true,
            message: "Product updated!",
            product: updatedProduct
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error
        })
    }
}
const paginationProduct = async (req, res) => {
    // Page no
    const pageNo = req.query.page || 1;

    //

    // Number of results per page
    const resultPerPage = 2;

    try {
        // Find all products, skip, limit
        const products = await productModel
            .find({})
            .skip((pageNo - 1) * resultPerPage)
            .limit(resultPerPage);

        // If page 6 is requested, result 0
        if (products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No products found',
            });
        }
        // response
        res.status(201).json({
            success: true,
            message: 'Products fetched successfully',
            products: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};



module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct,
    paginationProduct
};
