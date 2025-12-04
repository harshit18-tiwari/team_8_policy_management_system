import React, { useState } from 'react';
import { fetchWithAuth } from '../api';

function PremiumCalculator({ product, setView }) {
    const [age, setAge] = useState(30);
    const [coverage, setCoverage] = useState(10000);
    const [quote, setQuote] = useState(null);

    if (!product) return <div>No product selected.</div>;

    const handleCalculate = async () => {
        const res = await fetchWithAuth('/premium/calculate', {
            method: 'POST',
            body: JSON.stringify({
                productId: product.id,
                age: parseInt(age),
                coverageAmount: parseInt(coverage)
            })
        });
        const data = await res.json();
        setQuote(data);
    };

    return (
        <div className="card">
            <h2>Calculate Premium: {product.name}</h2>
            <label>Age:</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} />

            <label>Coverage Amount ($):</label>
            <input type="number" value={coverage} onChange={e => setCoverage(e.target.value)} />

            <button onClick={handleCalculate}>Get Quote</button>

            {quote && (
                <div className="quote-box">
                    <h3>Estimated Premium: ${quote.premiumAmount}</h3>
                    <button onClick={() => setView('purchase')}>Proceed to Buy</button>
                </div>
            )}
            <button className="secondary" onClick={() => setView('products')}>Back</button>
        </div>
    );
}

export default PremiumCalculator;
