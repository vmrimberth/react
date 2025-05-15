import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Modal from 'react-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Ruta de navegación (migajas de pan)
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Autors', href: '/autors' },
];

// Tipos para los datos del autor y las props que recibe el componente
type Autor = {
    id: number;
    nombre: string;
};

type Props = {
    autors: {
        data: Autor[];
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

export default function Autor({ autors, filters, flash }: Props) {
    // Estados del componente
    const [search, setSearch] = useState(filters.search); // Filtro de búsqueda
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal abierto/cerrado
    const [editingAutor, setEditingAutor] = useState<Autor | null>(null); // Autor actual en edición
    const [notification, setNotification] = useState<string | null>(null); // Mensaje flash

    // Manejo del formulario con Inertia
    const { data, setData, reset, post, put } = useForm({
        nombre: '',
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
    const openModal = (autor?: Autor) => {
        if (autor) {
            setEditingAutor(autor);
            setData({ nombre: autor.nombre}); // Prellenar formulario si es edición
        } else {
            setEditingAutor(null);
            reset(); // Limpiar formulario si es nuevo
        }
        setModalIsOpen(true);
    };

    // Cerrar modal
    const closeModal = () => {
        setModalIsOpen(false);
        reset();
        setEditingAutor(null);
    };

    // Buscar por título
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        router.get('/autors', { search: e.target.value }, { preserveState: true }); // Recarga con filtro
    };

    // Enviar formulario (crear o actualizar)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAutor) {
            put(`/autors/${editingAutor.id}`, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else {
            post('/autors', {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        }
    };

    // Eliminar un autor
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este autor?')) {
            router.delete(`/autors/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Autors" />

            {/* Notificación de éxito */}
            {notification && (
                <div className="fixed top-6 right-6 z-50 bg-blue-900 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
                    {notification}
                </div>
            )}

            <div className="space-y-4 font-sans text-gray-800">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-blue-900">Gestión de Autores</h1>
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
                    placeholder="Buscar por título"
                    className="mb-4 w-full p-3 border border-blue-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {/* Tabla de autors */}
                <div className="overflow-x-auto border border-blue-100 rounded-lg shadow bg-white">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-blue-900 text-white uppercase">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {autors.data.length > 0 ? (
                                autors.data.map((autor) => (
                                    <tr key={autor.id} className="border-t hover:bg-blue-50">
                                        <td className="px-6 py-4">{autor.nombre}</td>
                                        <td className="px-6 py-4 flex justify-center space-x-4">
                                            <button
                                                onClick={() => openModal(autor)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(autor.id)}
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
                                        No hay autores disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Controles de paginación */}
                <div className="mt-4 flex justify-end space-x-2">
                    {autors.links.prev && (
                        <a href={autors.links.prev} className="text-blue-600 hover:underline">
                            ← Anterior
                        </a>
                    )}
                    {autors.links.next && (
                        <a href={autors.links.next} className="text-blue-600 hover:underline">
                            Siguiente →
                        </a>
                    )}
                </div>
            </div>

            {/* Modal para crear o editar autor */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Autor Modal"
                ariaHideApp={false}
                className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow-lg border border-blue-200"
            >
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                    {editingAutor ? 'Editar Autor' : 'Crear nuevo Autor'}
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
                    <div className="flex justify-end gap-2">
                        <button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded"
                        >
                            {editingAutor ? 'Actualizar' : 'Crear'}
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
