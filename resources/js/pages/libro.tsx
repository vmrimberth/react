import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Modal from 'react-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Ruta de navegación (migajas de pan)
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Libros', href: '/libros' },
];

// Tipos para los datos del libro y las props que recibe el componente
type Libro = {
    id: number;
    titulo: string;
    descripcion: string;
    autor_id: number;
    ubicacion_id: number;
    categoria_id: number;
};

type Props = {
    libros: {
        data: Libro[];
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

export default function Libro({ libros, filters, flash }: Props) {
    // Estados del componente
    const [search, setSearch] = useState(filters.search); // Filtro de búsqueda
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal abierto/cerrado
    const [editingLibro, setEditingLibro] = useState<Libro | null>(null); // Libro actual en edición
    const [notification, setNotification] = useState<string | null>(null); // Mensaje flash

    // Manejo del formulario con Inertia
    const { data, setData, reset, post, put } = useForm({
        titulo: '',
        descripcion: '',
        autor_id: 0,
        ubicacion_id: 0,
        categoria_id: 0,
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
    const openModal = (libro?: Libro) => {
        if (libro) {
            setEditingLibro(libro);
            setData({ titulo: libro.titulo, descripcion: libro.descripcion, autor_id: libro.autor_id, ubicacion_id: libro.ubicacion_id, categoria_id: libro.categoria_id }); // Prellenar formulario si es edición
        } else {
            setEditingLibro(null);
            reset(); // Limpiar formulario si es nuevo
        }
        setModalIsOpen(true);
    };

    // Cerrar modal
    const closeModal = () => {
        setModalIsOpen(false);
        reset();
        setEditingLibro(null);
    };

    // Buscar por título
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        router.get('/libros', { search: e.target.value }, { preserveState: true }); // Recarga con filtro
    };

    // Enviar formulario (crear o actualizar)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLibro) {
            put(`/libros/${editingLibro.id}`, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else {
            post('/libros', {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        }
    };

    // Eliminar un libro
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
            router.delete(`/libros/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Libros" />

            {/* Notificación de éxito */}
            {notification && (
                <div className="fixed top-6 right-6 z-50 bg-blue-900 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
                    {notification}
                </div>
            )}

            <div className="space-y-4 font-sans text-gray-800">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-blue-900">Gestión de Libros</h1>
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

                {/* Tabla de Libros */}
                <div className="overflow-x-auto border border-blue-100 rounded-lg shadow bg-white">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-blue-900 text-white uppercase">
                            <tr>
                                <th className="px-6 py-3">Titulo</th>
                                <th className="px-6 py-3">Descripcion</th>
                                <th className="px-6 py-3">Autor</th>
                                <th className="px-6 py-3">Ubicacion</th>
                                <th className="px-6 py-3">Categoria</th>
                                <th className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {libros.data.length > 0 ? (
                                libros.data.map((libro) => (
                                    <tr key={libro.id} className="border-t hover:bg-blue-50">
                                        <td className="px-6 py-4">{libro.titulo}</td>
                                        <td className="px-6 py-4">{libro.descripcion}</td>
                                        <td className="px-6 py-4">{libro.autor_id}</td>
                                        <td className="px-6 py-4">{libro.ubicacion_id}</td>
                                        <td className="px-6 py-4">{libro.categoria_id}</td>
                                        <td className="px-6 py-4 flex justify-center space-x-4">
                                            <button
                                                onClick={() => openModal(libro)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(libro.id)}
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
                                        No hay libros disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Controles de paginación */}
                <div className="mt-4 flex justify-end space-x-2">
                    {libros.links.prev && (
                        <a href={libros.links.prev} className="text-blue-600 hover:underline">
                            ← Anterior
                        </a>
                    )}
                    {libros.links.next && (
                        <a href={libros.links.next} className="text-blue-600 hover:underline">
                            Siguiente →
                        </a>
                    )}
                </div>
            </div>

            {/* Modal para crear o editar libro */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Libro Modal"
                ariaHideApp={false}
                className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow-lg border border-blue-200"
            >
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                    {editingLibro ? 'Editar Libro' : 'Crear nuevo Libro'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={data.titulo}
                        onChange={(e) => setData('titulo', e.target.value)}
                        placeholder="Titulo"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        value={data.descripcion}
                        onChange={(e) => setData('descripcion', e.target.value)}
                        placeholder="Descripcion"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="number"
                        value={data.autor_id}
                        onChange={(e) => setData('autor_id', e.target.valueAsNumber)}
                        placeholder="Autor"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="number"
                        value={data.ubicacion_id}
                        onChange={(e) => setData('ubicacion_id', e.target.valueAsNumber)}
                        placeholder="Ubicacion"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="number"
                        value={data.categoria_id}
                        onChange={(e) => setData('categoria_id', e.target.valueAsNumber)}
                        placeholder="Categoria"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded"
                        >
                            {editingLibro ? 'Actualizar' : 'Crear'}
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
