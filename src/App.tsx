import { useEffect, useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ProductCard from "./components/ProductCard";
import { products, type Product } from "./data/productsData";
import ProductModal from "./components/ProductsDlg";
import { getToLocalStorage, isItemOfLocalStorage, setToLocalStorage } from "./common/coustomHooks";

function App() {
  const [productsList, setProductsList] = useState<Array<Product>>([]);
  const [show, setShow] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [editFormData, setEditFormData] = useState<Product>({
    id: "",
    name: "",
    sku: "",
    price: 0,
    quantity: 0,
    category: "",
  });
  const categories = useMemo(() => {
    const cats: any = [];
    productsList.forEach((p) => {
      if (!cats.includes(p.category)) {
        cats.push(p.category);
      }
    });
    return cats;
  }, []);

  useEffect(()=>{
    if(!isItemOfLocalStorage('productsList')){
      setToLocalStorage('productsList', products)
    }
    setProductsList(getToLocalStorage('productsList'))
  },[])

  const skuList = useMemo(() => {
    const skuData: any = [];
    productsList.forEach((p) => {
      if (!skuData.includes(p.sku)) {
        skuData.push(p.sku);
      }
    });
    return skuData;
  }, [productsList]);
  const onSave = (formData: Product) => {
    if (editMode) {
      const modifiedData: any = productsList.map((ele) => {
        if (ele.id === formData.id) {
          return formData;
        } else {
          return ele;
        }
      });
      setToLocalStorage('productsList', modifiedData)
      setProductsList(modifiedData);
    } else {
      const modifiedData =[
        ...productsList,
        { ...formData, id: JSON.stringify(productsList.length) },
      ]
      setToLocalStorage('productsList', modifiedData)
      setProductsList(modifiedData);
    }
  };
  const openDlg = (formData: Product) => {
    setEditFormData(formData);
    setEditMode(true);
    setShow(true);
   
  };

  const onClose = () => {
    setEditMode(false);
    setShow(false);
    setEditFormData({
      id: "",
      name: "",
      sku: "",
      price: 0,
      quantity: 0,
      category: "",
    });
  };

  const debounce = (fun: (value: string) => void, timeOut: number) => {
    let TimeOutID: number;

    return (value: string) => {
      clearTimeout(TimeOutID);
      TimeOutID = setTimeout(() => {
        fun(value);
      }, timeOut);
    };
  };

  const onUserStrokes = debounce((value) => {
    setSearch(value);
  }, 1000);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search);

      const matchesCategory = !category || p.category === category;

      const matchesStock =
        !stock ||
        (stock === "in" && p.quantity > 10) ||
        (stock === "low" && p.quantity <= 10 && p.quantity !== 0) ||
        (stock === "out" && p.quantity === 0);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [search, category, stock, productsList]);
  return (
    <>
      <div>
        <h1>Product Inventory</h1>

        <div>
          <div className="main-card-header">
            <div>
              <label htmlFor="html">Search:</label>
              <input
                id="html"
                onChange={(e) => onUserStrokes(e.target.value)}
                className="gap"
              />
              <label>Filters:</label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="gap"
              >
                <option value="">All Categories</option>
                {categories.map((ele: any) => {
                  return <option value={ele}>{ele}</option>;
                })}
              </select>
              <select
                onChange={(e) => setStock(e.target.value)}
                className="gap"
              >
                <option value="">All Stock</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            <div>
              <button onClick={() => setShow(true)} className="add-btn">Add Product</button>
            </div>
          </div>
          {show && (
            <ProductModal
              onSave={(formData) => onSave(formData)}
              editMode={editMode}
              onClose={() => onClose()}
              formData={editFormData}
              skuList={skuList}
            />
          )}
          <div className="container" style={{
              ...(filteredProducts.length === 0 && { justifyContent: 'center' })
          }}>
            { filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                openDlg={(product) => openDlg(product)}
              />
            )) : <h1> No Result Found</h1>}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
