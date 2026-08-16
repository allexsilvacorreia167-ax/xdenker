import { Routes, Route } from 'react-router-dom';
import ResponsiveUserLayout from './layouts/ResponsiveUserLayout';
import AdminDesktopLayout from './layouts/AdminDesktopLayout';
import HomePage from './pages/HomePage';
import PesquisasPage from './pages/PesquisasPage';
import BlogPage from './pages/BlogPage';
import ContatoPage from './pages/ContatoPage';
import MetodologiaPage from './pages/MetodologiaPage';
import QuestionarioPage from './pages/QuestionarioPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCandidatos from './pages/admin/AdminCandidatos';
import AdminPerguntas from './pages/admin/AdminPerguntas';
import AdminEspectro from './pages/admin/AdminEspectro';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminBlog from './pages/admin/AdminBlog';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ResponsiveUserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pesquisas" element={<PesquisasPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/metodologia" element={<MetodologiaPage />} />
          <Route path="/questionario" element={<QuestionarioPage />} />
        </Route>

        <Route path="/html/adm" element={<AdminDesktopLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="candidatos" element={<AdminCandidatos />} />
          <Route path="perguntas" element={<AdminPerguntas />} />
          <Route path="espectro" element={<AdminEspectro />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
