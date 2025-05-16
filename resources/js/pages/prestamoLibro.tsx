import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Modal from 'react-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Ruta de navegación (migajas de pan)
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'PrestamoLibros', href: '/prestamoLibros' },
];

// Tipos para los datos del prestamoLibro y las props que recibe el componente
type PrestamoLibro = {
    id: number;
    libro_id: number;
    persona_id: number;
};

type Props = {
    prestamoLibros: {
        data: PrestamoLibro[];
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

export default function PrestamoLibro({ prestamoLibros, filters, flash }: Props) {
    // Estados del componente
    const [search, setSearch] = useState(filters.search); // Filtro de búsqueda
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal abierto/cerrado
    const [editingPrestamoLibro, setEditingPrestamoLibro] = useState<PrestamoLibro | null>(null); // PrestamoLibro actual en edición
    const [notification, setNotification] = useState<string | null>(null); // Mensaje flash

    // Manejo del formulario con Inertia
    const { data, setData, reset, post, put } = useForm({
        libro_id: 0,
        persona_id: 0,
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
    const openModal = (prestamoLibro?: PrestamoLibro) => {
        if (prestamoLibro) {
            setEditingPrestamoLibro(prestamoLibro);
            setData({ libro_id: prestamoLibro.libro_id, persona_id: prestamoLibro.persona_id }); // Prellenar formulario si es edición
        } else {
            setEditingPrestamoLibro(null);
            reset(); // Limpiar formulario si es nuevo
        }
        setModalIsOpen(true);
    };

    // Cerrar modal
    const closeModal = () => {
        setModalIsOpen(false);
        reset();
        setEditingPrestamoLibro(null);
    };

    // Buscar por título
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        router.get('/prestamoLibros', { search: e.target.value }, { preserveState: true }); // Recarga con filtro
    };

    // Enviar formulario (crear o actualizar)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPrestamoLibro) {
            put(`/prestamoLibros/${editingPrestamoLibro.id}`, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else {
            post('/prestamoLibros', {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        }
    };

    // Eliminar un prestamoLibro
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este prestamoLibro?')) {
            router.delete(`/prestamoLibros/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prestamo de Libros" />

            {/* Notificación de éxito */}
            {notification && (
                <div className="fixed top-6 right-6 z-50 bg-blue-900 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
                    {notification}
                </div>
            )}

            <div className="space-y-4 font-sans text-gray-800">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-blue-900">Gestión de Prestamo de Libros</h1>
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

                {/* Tabla de PrestamoLibros */}
                <div className="overflow-x-auto border border-blue-100 rounded-lg shadow bg-white">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-blue-900 text-white uppercase">
                            <tr>
                                <th className="px-6 py-3">Libro</th>
                                <th className="px-6 py-3">Persona</th>
                                <th className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prestamoLibros.data.length > 0 ? (
                                prestamoLibros.data.map((prestamoLibro) => (
                                    <tr key={prestamoLibro.id} className="border-t hover:bg-blue-50">
                                        <td className="px-6 py-4">{prestamoLibro.libro_id}</td>
                                        <td className="px-6 py-4">{prestamoLibro.persona_id}</td>
                                        <td className="px-6 py-4 flex justify-center space-x-4">
                                            <button
                                                onClick={() => openModal(prestamoLibro)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(prestamoLibro.id)}
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
                                        No hay prestamoLibros disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Controles de paginación */}
                <div className="mt-4 flex justify-end space-x-2">
                    {prestamoLibros.links.prev && (
                        <a href={prestamoLibros.links.prev} className="text-blue-600 hover:underline">
                            ← Anterior
                        </a>
                    )}
                    {prestamoLibros.links.next && (
                        <a href={prestamoLibros.links.next} className="text-blue-600 hover:underline">
                            Siguiente →
                        </a>
                    )}
                </div>
            </div>

            {/* Modal para crear o editar prestamoLibro */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="PrestamoLibro Modal"
                ariaHideApp={false}
                className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow-lg border border-blue-200"
            >
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                    {editingPrestamoLibro ? 'Editar Prestamo de Libro' : 'Crear nuevo Prestamo de Libro'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        value={data.libro_id}
                        onChange={(e) => setData('libro_id', e.target.valueAsNumber)}
                        placeholder="Libro"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="number"
                        value={data.persona_id}
                        onChange={(e) => setData('persona_id', e.target.valueAsNumber)}
                        placeholder="Persona"
                        className="w-full p-3 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded"
                        >
                            {editingPrestamoLibro ? 'Actualizar' : 'Crear'}
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
