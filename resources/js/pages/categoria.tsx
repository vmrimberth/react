import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Modal from 'react-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Ruta de navegación (migajas de pan)
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categorias', href: '/categorias' },
];

// Tipos para los datos del categoria y las props que recibe el componente
type Categoria = {
    id: number;
    nombre: string;
    codigo: string;
};

type Props = {
    categorias: {
        data: Categoria[];
        links: {
            prev: string | null;
            next: string | null;
        };
    };
    filters: {
        search: string;
    };
    flash: {
        success?: string;
    };
};

export default function Categoria({ categorias, filters, flash }: Props) {
    // Estados del componente
    const [search, setSearch] = useState(filters.search); // Filtro de búsqueda
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal abierto/cerrado
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null); // Categoria actual en edición
    const [notification, setNotification] = useState<string | null>(null); // Mensaje flash

    // Manejo del formulario con Inertia
    const { data, setData, reset, post, put } = useForm({
        nombre: '',
        codigo: '',
    });

    // Mostrar notificación cuando Laravel envíe un mensaje flash
    useEffect(() => {
        if (flash.success) {
            setNotification(flash.success);
            const timer = setTimeout(() => setNotification(null), 5000); // Oculta después de 5 segundos
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Abrir el modal para crear o editar
    const openModal = (categoria?: Categoria) => {
        if (categoria) {
            setEditingCategoria(categoria);
            setData({ nombre: categoria.nombre, codigo: categoria.codigo }); // Prellenar formulario si es edición
        } else {
            setEditingCategoria(null);
            reset(); // Limpiar formulario si es nuevo
        }
        setModalIsOpen(true);
    };

    // Cerrar modal
    const closeModal = () => {
        setModalIsOpen(false);
        reset();
        setEditingCategoria(null);
    };

    // Buscar por título
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        router.get('/categorias', { search: e.target.value }, { preserveState: true }); // Recarga con filtro
    };

    // Enviar formulario (crear o actualizar)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategoria) {
            put(`/categorias/${editingCategoria.id}`, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else {
            post('/categorias', {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        }
    };

    // Eliminar un categoria
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este categoria?')) {
            router.delete(`/categorias/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias" />

            {/* Notificación de éxito */}
            {notification && (
                <div className="fixed top-6 right-6 z-50 bg-blue-900 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
                    {notification}
                </div>
            )}

            <div className="space-y-4 font-sans text-gray-800">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-blue-900">Gestión de Categorias</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded shadow"
                    >
                        + Crear nuevo
                    </button>
                </div>

                {/* Campo de búsqueda */}
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre"
                    className="mb-4 w-full p-3 border border-blue-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {/* Tabla de categorias */}
                <div className="overflow-x-auto border border-blue-100 rounded-lg shadow bg-white">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-blue-900 text-white uppercase">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Codigo</th>
                                <th className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.data.length > 0 ? (
                                categorias.data.map((categoria) => (
                                    <tr key={categoria.id} className="border-t hover:bg-blue-50">
                                        <td className="px-6 py-4">{categoria.nombre}</td>
                                        <td className="px-6 py-4">{categoria.codigo}</td>
                                        <td className="px-6 py-4 flex justify-center space-x-4">
                                            <button
                                                onClick={() => openModal(categoria)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(categoria.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center px-6 py-6 text-gray-500">
                                        No hay categorias disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Controles de paginación */}
                <div className="mt-4 flex justify-end space-x-2">
                    {categorias.links.prev && (
                        <a href={categorias.links.prev} className="text-blue-600 hover:underline">
                            ← Anterior
                        </a>
                    )}
                    {categorias.links.next && (
                        <a href={categorias.links.next} className="text-blue-600 hover:underline">
                            Siguiente →
                        </a>
                    )}
                </div>
            </div>

            {/* Modal para crear o editar categoria */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Categoria Modal"
                ariaHideApp={false}
                className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow-lg border border-blue-200"
            >
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                    {editingCategoria ? 'Editar Categoria' : 'Crear nuevo Categoria'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        placeholder="Nombre"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        value={data.codigo}
                        onChange={(e) => setData('codigo', e.target.value)}
                        placeholder="Codigo"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded"
                        >
                            {editingCategoria ? 'Actualizar' : 'Crear'}
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
