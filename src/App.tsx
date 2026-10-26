import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "@/components/AppLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import { pageByPath } from "@/routes";

const routes = Object.entries(pageByPath);

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    {routes.map(([path, Page]) => (
                        <Route key={path} path={path} element={<Page />} />
                    ))}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
