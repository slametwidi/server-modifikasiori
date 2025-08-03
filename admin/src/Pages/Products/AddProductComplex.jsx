import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import UploadBox from '../Components/UploadBox';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

const kartelVariants = ['custom lobang', 'kartel miring', 'kartel lurus', 'kartel silang'];

export default function AddProductComplex() {
  const base = import.meta.env.VITE_API_BASE_URL;

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      motors: [],
      images: []
    }
  });

  const { fields: motorFields, append: addMotor, remove: removeMotor } = useFieldArray({
    control,
    name: 'motors'
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      description: data.description || '',
      images: data.images || [],
      productStructure: data.motors
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${base}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal menambahkan produk');
      }

      toast.success('Produk kompleks berhasil ditambahkan!');
      reset(); // Kosongkan form setelah sukses
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Nama Produk</h2>
      <input {...register('name', { required: true })} className="input mb-4 w-full border p-2 rounded" />

      <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
      <input {...register('description')} className="input mb-4 w-full border p-2 rounded" />

      <Button
        type="button"
        variant="outlined"
        onClick={() =>
          addMotor({
            kode: '',
            variants: kartelVariants.map((v) => ({
              variant: v,
              tipe: [
                { name: 'M1', hpp: 0, umum: 0, reseller: 0 },
                { name: 'M2', hpp: 0, umum: 0, reseller: 0 }
              ]
            }))
          })
        }
        className="mb-4"
      >
        + Tambah Kode Motor
      </Button>

      {motorFields.map((motor, mi) => (
        <div key={motor.id} className="mb-6 p-4 border border-gray-300 rounded">
          <div className="mb-3 flex justify-between items-center">
            <label className="font-medium">Kode Motor:</label>
            <input
              {...register(`motors.${mi}.kode`, { required: true })}
              className="input border px-2 py-1 w-64"
            />
            <Button type="button" color="error" onClick={() => removeMotor(mi)}>
              Hapus
            </Button>
          </div>

          {motor.variants.map((variant, vi) => (
            <fieldset key={vi} className="ml-4 mb-4 border-l pl-4">
              <legend className="font-semibold mb-2">{variant.variant}</legend>
              {variant.tipe.map((tipe, ti) => (
                <div key={ti} className="ml-4 mb-3">
                  <strong className="block">{tipe.name}</strong>
                  <div className="flex gap-4">
                    {['hpp', 'umum', 'reseller'].map((f) => (
                      <div key={f}>
                        <label className="block text-sm">{f.toUpperCase()}</label>
                        <Controller
                          control={control}
                          name={`motors.${mi}.variants.${vi}.tipe.${ti}.${f}`}
                          defaultValue={tipe[f]}
                          render={({ field }) => (
                            <input
                              type="number"
                              min="0"
                              {...field}
                              className="input border px-2 py-1 w-24"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              required
                            />
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>
          ))}
        </div>
      ))}

      <h3 className="mb-2 font-semibold">Upload Gambar</h3>
      <Controller
        control={control}
        name="images"
        defaultValue={[]}
        render={({ field: { value, onChange } }) => (
          <UploadBox onUpload={(url) => onChange([...(value || []), url])} />
        )}
      />

      <Button type="submit" variant="contained" color="primary" className="mt-6">
        Simpan Produk Kompleks
      </Button>
    </form>
  );
}
