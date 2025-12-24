import type { Product } from "../data/productsData";
import "./ProductCard.css";
interface Props {
  product: Product;
  openDlg: (product: Product) => void;
  handleDeleteAction: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const getStatus = (quantity: number) => {
  if (quantity === 0) return { text: "Out of Stock", color: "#e74c3c" };
  if (quantity <= 10) return { text: "Low Stock", color: "#f1c40f" };
  return { text: "In Stock", color: "#2ecc71" };
};

export default function ProductCard({ product, openDlg, handleDeleteAction }: Props) {
  const status = getStatus(product.quantity);

  return (
    <div onClick={() => openDlg(product)} className="card">
      <div className="hader-section">
        
        <div>
          <h3 style={{ margin: 0, padding:0 }}>{product.name}</h3>
        </div>
        <div onClick={handleDeleteAction}>&#x00D7;</div>
      </div>

      <p>
        <strong>SKU:</strong> {product.sku}
      </p>
      <p>
        <strong>Price:</strong> ${product.price.toFixed(2)}
      </p>
      <p>
        <strong>Quantity:</strong> {product.quantity}
      </p>
      <p>
        <strong>Category:</strong> {product.category}
      </p>

      <div style={{ backgroundColor: status.color }} className="stock-btn">
        {status.text}
      </div>
    </div>
  );
}
