import { useEffect } from 'react';
import {
    Routes,
    Route,
    useLocation,
    useNavigate,
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

// Pages
import {
    ConstructorPage,
    Feed,
    Login,
    Register,
    ForgotPassword,
    ResetPassword,
    Profile,
    ProfileOrders,
    NotFound404,
} from '@pages';

// Components
import {
    AppHeader,
    IngredientDetails,
    OrderInfo,
    Modal,
    ProtectedRoute,
} from '@components';

// UI
import { Preloader } from '@ui';

// Redux
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { checkUserAuth } from '../../services/slices/user-slice';

const App = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // Ingredients data from Redux
    const { ingredients, isLoading, error } = useSelector(
        (state) => state.ingredients
    );

    // Check if we’re in modal mode (background location exists)
    const background = location.state?.background;

    useEffect(() => {
        dispatch(fetchIngredients());
        dispatch(checkUserAuth());
    }, [dispatch]);

    const closeModal = () => navigate(-1);

    if (isLoading) {
        return <Preloader />;
    }

    /**
     * Main routes: public and protected pages
     */
    const mainRoutes = (
        <Routes location={background || location}>
            <Route path="/" element={<ConstructorPage />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/:number" element={<OrderInfo />} />
            <Route path="/ingredients/:id" element={<IngredientDetails />} />

            {/* Auth pages: available only for unauthenticated users */}
            <Route
                path="/login"
                element={
                    <ProtectedRoute onlyUnAuth>
                        <Login />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <ProtectedRoute onlyUnAuth>
                        <Register />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <ProtectedRoute onlyUnAuth>
                        <ForgotPassword />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <ProtectedRoute onlyUnAuth>
                        <ResetPassword />
                    </ProtectedRoute>
                }
            />

            {/* Profile pages: protected routes */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile/orders"
                element={
                    <ProtectedRoute>
                        <ProfileOrders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile/orders/:number"
                element={
                    <ProtectedRoute>
                        <OrderInfo />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<NotFound404 />} />
        </Routes>
    );

    /**
     * Modal routes: rendered on top of main routes when background location exists
     */
    const modalRoutes = background ? (
        <Routes>
            <Route
                path="/ingredients/:id"
                element={
                    <Modal title="Ingredient Details" onClose={closeModal}>
                        <IngredientDetails />
                    </Modal>
                }
            />
            <Route
                path="/feed/:number"
                element={
                    <Modal title="" onClose={closeModal}>
                        <OrderInfo />
                    </Modal>
                }
            />
            <Route
                path="/profile/orders/:number"
                element={
                    <ProtectedRoute>
                        <Modal title="" onClose={closeModal}>
                            <OrderInfo />
                        </Modal>
                    </ProtectedRoute>
                }
            />
        </Routes>
    ) : null;

    return (
        <div className={styles.app}>
            <AppHeader />

            {error ? (
                <div className={`${styles.error} text text_type_main-medium pt-4`}>
                    {error}
                </div>
            ) : ingredients.length ? (
                <>
                    {mainRoutes}
                    {modalRoutes}
                </>
            ) : (
                <div className={`${styles.title} text text_type_main-medium pt-4`}>
                    No ingredients available
                </div>
            )}
        </div>
    );
};

export default App;
