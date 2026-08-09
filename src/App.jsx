import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AccountLayout from "./layouts/AccountLayout.jsx";
import { ProtectedRoute, AdminProtectedRoute } from "./components/ProtectedRoute.jsx";
import PageLoader from "./components/ui/PageLoader.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.jsx"));
const Content = lazy(() => import("./pages/Content.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const StaticPage = lazy(() => import("./pages/StaticPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const AccountDashboard = lazy(() => import("./pages/account/Dashboard.jsx"));
const AccountOrders = lazy(() => import("./pages/account/Orders.jsx"));
const AccountOrderDetail = lazy(() => import("./pages/account/OrderDetail.jsx"));
const AccountWishlist = lazy(() => import("./pages/account/Wishlist.jsx"));
const AccountAddresses = lazy(() => import("./pages/account/Addresses.jsx"));
const AccountProfile = lazy(() => import("./pages/account/Profile.jsx"));

const AdminLogin = lazy(() => import("./pages/admin/Login.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/Orders.jsx"));
const AdminOrderDetail = lazy(() => import("./pages/admin/OrderDetail.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/Products.jsx"));
const AdminProductForm = lazy(() => import("./pages/admin/ProductForm.jsx"));
const AdminCategories = lazy(() => import("./pages/admin/Categories.jsx"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers.jsx"));
const AdminCustomerDetail = lazy(() => import("./pages/admin/CustomerDetail.jsx"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews.jsx"));
const AdminCoupons = lazy(() => import("./pages/admin/Coupons.jsx"));
const AdminPortfolio = lazy(() => import("./pages/admin/Portfolio.jsx"));
const AdminContent = lazy(() => import("./pages/admin/Content.jsx"));
const AdminSocials = lazy(() => import("./pages/admin/Socials.jsx"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings.jsx"));
const AdminCollaborations = lazy(() => import("./pages/admin/Collaborations.jsx"));
const AdminMessages = lazy(() => import("./pages/admin/Messages.jsx"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics.jsx"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/Settings.jsx"));
const AdminShipping = lazy(() => import("./pages/admin/Shipping.jsx"));
const AdminUsers = lazy(() => import("./pages/admin/Users.jsx"));
const AdminActivityLogs = lazy(() => import("./pages/admin/ActivityLogs.jsx"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/content" element={<Content />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/privacy-policy" element={<StaticPage type="privacy" />} />
          <Route path="/terms" element={<StaticPage type="terms" />} />
          <Route path="/refund-policy" element={<StaticPage type="refund" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<AccountDashboard />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="orders/:id" element={<AccountOrderDetail />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="profile" element={<AccountProfile />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="notifications" element={<AdminNotifications />} />

            <Route element={<AdminProtectedRoute section="orders" />}>
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
            </Route>
            <Route element={<AdminProtectedRoute section="products" />}>
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
            </Route>
            <Route element={<AdminProtectedRoute section="categories" />}>
              <Route path="categories" element={<AdminCategories />} />
            </Route>
            <Route element={<AdminProtectedRoute section="customers" />}>
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="customers/:id" element={<AdminCustomerDetail />} />
            </Route>
            <Route element={<AdminProtectedRoute section="reviews" />}>
              <Route path="reviews" element={<AdminReviews />} />
            </Route>
            <Route element={<AdminProtectedRoute section="coupons" />}>
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>
            <Route element={<AdminProtectedRoute section="portfolio" />}>
              <Route path="portfolio" element={<AdminPortfolio />} />
            </Route>
            <Route element={<AdminProtectedRoute section="content" />}>
              <Route path="content" element={<AdminContent />} />
            </Route>
            <Route element={<AdminProtectedRoute section="socials" />}>
              <Route path="socials" element={<AdminSocials />} />
            </Route>
            <Route element={<AdminProtectedRoute section="bookings" />}>
              <Route path="bookings" element={<AdminBookings />} />
            </Route>
            <Route element={<AdminProtectedRoute section="collaborations" />}>
              <Route path="collaborations" element={<AdminCollaborations />} />
            </Route>
            <Route element={<AdminProtectedRoute section="messages" />}>
              <Route path="messages" element={<AdminMessages />} />
            </Route>
            <Route element={<AdminProtectedRoute section="settings" />}>
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route element={<AdminProtectedRoute section="shipping" />}>
              <Route path="shipping" element={<AdminShipping />} />
            </Route>
            <Route path="users" element={<AdminUsers />} />
            <Route path="activity-logs" element={<AdminActivityLogs />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
