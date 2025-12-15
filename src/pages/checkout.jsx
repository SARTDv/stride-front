import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import api from '../api/axiosInstance';

const Checkout = () => {
  const [pendingOrder, setPendingOrder] = useState(null);
  const [hasPendingOrders, setHasPendingOrders] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [shipInfo, setShipInfo] = useState({
    first_name: "",
    last_name: "",
    address: "",
    town: "",
    zip_code: "",
    phone_num: "",
    com: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleShipChange = (e) => {
    const { name, value } = e.target;
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handlePayment = async () => {
    // Verificación de campos requeridos
    const requiredPaymentFields = ["cardNumber", "expiryDate", "cvv"];
    const requiredShippingFields = ["first_name", "last_name", "address", "zip_code"];
  
    const isPaymentValid = requiredPaymentFields.every((field) => paymentInfo[field].trim() !== "");
    const isShippingValid = requiredShippingFields.every((field) => shipInfo[field].trim() !== "");
  
    if (!isPaymentValid) {
      toast.error("Please complete all required payment fields.");
      return;
    }
    
    if (!isShippingValid) {
      toast.error("Please complete all required shipping fields.");
      return;
    }    
    
    try {
      const response = await api.post(
        "/api/orders/process-payment/",
        { ship_info: shipInfo }
      );
      toast.success(response.data.message);
      navigate('/cart');
    } catch (error) {
      console.error("Error processing payment:", error.response || error.message);
      toast.error("Error processing payment: " + (error.response?.data.error || error.message));
    }
  };
  

  useEffect(() => {
    const checkPendingOrders = async () => {
      try {
        const response = await api.get('/api/orders/check-pending/');
        setHasPendingOrders(response.data.has_pending);

        if (response.data.has_pending) {
          setPendingOrder(response.data.order); // Guarda la orden en el estado
        } else {
          toast.info("You have no pending orders to pay for.");
          navigate('/cart');
        }
      } catch (error) {
        console.error('Error checking pending orders:', error);
        toast.error('Error checking orders.');
        navigate('/cart'); // Redirigir al carrito en caso de error
      } finally {
        setLoading(false); // Termina el estado de carga
      }
    };

    checkPendingOrders();
  }, []);

  if (!hasPendingOrders || loading) {
    return null;
  }

  return (
    <div className="cart-table-area section-padding-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="checkout_details_area mt-50 clearfix">
              <div className="cart-title">
                <h2>Checkout</h2>
              </div>
              <form>
                <div className="row">
                  <div className="col-12 mb-3">
                    <input type="number" className="form-control" name="cardNumber" placeholder="Card Number" value={paymentInfo.cardNumber} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Expiry Date" name="expiryDate" value={paymentInfo.expiryDate} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="number" className="form-control" placeholder="CVV" name="cvv" value={paymentInfo.cvv} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" name="first_name" value={shipInfo.first_name} placeholder="First Name" onChange={handleShipChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" name="last_name" value={shipInfo.last_name} placeholder="Last Name" onChange={handleShipChange} required />
                  </div>
                  <div className="col-12 mb-3">
                    <input type="text" className="form-control" name="address" placeholder="Address" value={shipInfo.address} onChange={handleShipChange} required />
                  </div>
                  <div className="col-12 mb-3">
                    <input type="text" className="form-control" name="town" placeholder="Town" value={shipInfo.town} onChange={handleShipChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" name="zip_code" placeholder="Zip Code" value={shipInfo.zip_code} onChange={handleShipChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="number" className="form-control" name="phone_num" min="0" placeholder="Phone No" value={shipInfo.phone_num} onChange={handleShipChange} />
                  </div>
                  <div className="col-12 mb-3">
                    <textarea name="com" value={shipInfo.com} className="form-control w-100" cols="30" rows="10" placeholder="Leave a comment about your order" onChange={handleShipChange}></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="cart-summary">
              <h5>Cart Total</h5>
              <ul className="product-table">
                {pendingOrder.order_items.map((item) => (
                  <li key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{item.quantity}x {item.product_name}</span>
                    <span>${(item.quantity * item.product_price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <ul className="summary-table">
                <li><span>subtotal:</span> <span>${pendingOrder.total_price.toFixed(2)}</span></li>
                <li><span>delivery:</span> <span>Free</span></li>
                <li><span>total:</span> <span>${pendingOrder.total_price.toFixed(2)}</span></li>
              </ul>
              <div className="cart-btn mt-50">
                <button className="btn amado-btn w-100" onClick={handlePayment}>Pay</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
