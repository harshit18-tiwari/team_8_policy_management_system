const ProductModel = require('../models/ProductModel');

exports.calculatePremium = (req, res) => {
    const { productId, age, coverageAmount } = req.body;

    const product = ProductModel.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // --- SIMPLE PREMIUM LOGIC ---
    // 1. Base price from DB
    let premium = product.base_price;

    // 2. Age Factor (Older = more expensive for health, younger = more for auto)
    if (product.type === 'HEALTH') {
        if (age > 50) premium *= 1.5;
        else if (age > 30) premium *= 1.2;
    } else if (product.type === 'AUTO') {
        if (age < 25) premium *= 1.3; // Young drivers pay more
    }

    // 3. Coverage Factor (Simple multiplier logic)
    // Assume base price covers up to 10,000. 
    // For every extra 10,000, add 10% to premium.
    const baseCoverage = 10000;
    if (coverageAmount > baseCoverage) {
        const extraUnits = (coverageAmount - baseCoverage) / 10000;
        premium += (premium * 0.1 * extraUnits);
    }

    res.json({
        productId,
        productName: product.name,
        premiumAmount: Math.round(premium * 100) / 100 // Round to 2 decimals
    });
};
