import { Route, Routes, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// pagesフォルダ内のサブフォルダも含む.tsxファイルを動的に読み込む
const pages = import.meta.glob("./pages/**/*.tsx");

interface RouteInfo {
  name: string;
  path: string;
  component: React.ComponentType;
  parent?: string; // 親のパス（サブフォルダの場合に使用）
}

const App: React.FC = () => {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const location = useLocation(); // パンくずリスト用に現在のURLを取得

  useEffect(() => {
    const loadPages = async () => {
      const loadedRoutes = await Promise.all(
        Object.entries(pages).map(async ([path, resolver]) => {
          const cleanPath = path
            .replace("./pages", "")
            .replace(".tsx", "")
            .toLowerCase(); // パスをクリーニング
          const componentName = cleanPath.split("/").pop() || ""; // ファイル名を取得
          const Component = (await resolver()).default; // コンポーネントを動的にインポート

          // 親フォルダがあるか確認
          const parentPath = cleanPath.includes("/")
            ? cleanPath.substring(0, cleanPath.lastIndexOf("/"))
            : null;

          return {
            name:
              componentName.charAt(0).toUpperCase() + componentName.slice(1), // コンポーネント名をキャピタライズ
            path: cleanPath,
            component: Component,
            parent: parentPath ? parentPath.replace("/", "") : null, // 親フォルダを記録
          };
        })
      );
      setRoutes(loadedRoutes);
    };

    loadPages();
  }, []);

  // パンくずリストの生成
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return (
      <nav className="breadcrumb">
        <ul className="flex space-x-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            return (
              <li key={to}>
                <span className="mx-2">/</span>
                <Link to={to}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  };

  // 再帰的にリストを描画
  const renderNestedList = (parent: string | null = null): JSX.Element[] => {
    // 親が一致するページ（トップレベルはparentがnull）
    const filteredRoutes = routes.filter((route) => route.parent === parent);

    return filteredRoutes.map((page) => (
      <li key={page.path}>
        <div className="font-bold">
          <Link to={page.path}>{page.name}</Link>
        </div>
        {/* サブページがあるかどうか確認し、あれば再帰的に描画 */}
        <ul className="ml-4">
          {renderNestedList(page.path)} {/* 再帰的にサブフォルダの描画 */}
        </ul>
      </li>
    ));
  };

  return (
    <div className="min-h-screen items-center justify-center flex flex-col">
      {/* パンくずリストの表示 */}
      <div className="mb-4">{generateBreadcrumbs()}</div>

      {/* Routing */}
      <div className="text-2xl font-bold flex">
        <Routes>
          {routes.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<page.component />}
            />
          ))}
        </Routes>
      </div>

      {/* 再帰的リスト表示 */}
      <div className="flex text-blue-600 dark:text-blue-500">
        <ul>{renderNestedList()}</ul> {/* トップレベルから再帰的に表示 */}
      </div>
    </div>
  );
};

export default App;
