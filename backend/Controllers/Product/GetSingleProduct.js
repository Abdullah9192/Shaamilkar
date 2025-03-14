const getProductById = async (req, res) => {
  const fetch = (await import("node-fetch")).default;
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2025-01/products/${id}.json`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_API_PASSWORD}`
            ).toString("base64"),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProductById };
