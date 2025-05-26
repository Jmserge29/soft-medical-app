import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useAuthStore } from '@auth/stores/auth';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SurgicalInstrumentRoutes } from '@/modules/surgical-instrument-maker/utils/routes/SurgicalInstrumentRoutes';

const Login = () => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const setData = useAuthStore((state) => state.setData);

  const FormLoginSchema = z.object({
    usuario: z
      .string()
      .trim()
      .min(1, 'Se requiere')
      .min(10, 'Mínimo 10 caracteres')
      .max(10, 'Máximo 10 caracteres'),
    contrasenia: z
      .string()
      .trim()
      .min(1, 'Se requiere')
      .min(6, 'Mínimo 6 caracteres')
      .max(15, 'Máximo 15 caracteres'),
  });

  const form = useForm<z.infer<typeof FormLoginSchema>>({
    resolver: zodResolver(FormLoginSchema),
    defaultValues: {
      usuario: '',
      contrasenia: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormLoginSchema>) => {
    setFormLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          usuario: data.usuario,
          contrasenia: data.contrasenia,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.mensaje);
        setData({
          accessToken: res.data.datos.accessToken,
          refreshToken: undefined,
          user: {
            idRol: res.data.datos.idRol,
            idUsuario: res.data.datos.idUsuario,
            nombreCompleto: res.data.datos.nombreCompleto,
            correoElectronico: res.data.datos.correoElectronico,
            permisos: res.data.datos.permisos,
            usuario: res.data.datos.usuario,
          },
        });

        setTimeout(() => {
          window.location.href = `${SurgicalInstrumentRoutes.RegisterInstruments}`;
        }, 500);
      }
    } catch (error) {
      console.log('Error al iniciar sesión: ', error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="gradient-background w-2/4 rounded-tr-[50px] rounded-br-[50px]"></div>

      <div className="w-2/4 flex items-center justify-center bg-white">
        {/* Card */}
        <div className="space-y-7">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-[2px]">
              Iniciar Sesión
            </h2>
            <p className="text-gray-500 text-sm tracking-[1px]">
              Bienvenido nuevamente! Por favor ingresar las credenciales.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="usuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tracking-[1px]">
                      Identificación
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="########"
                        className="p-6 rounded-2xl tracking-[2px]"
                        disabled={formLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contrasenia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tracking-[1px]">Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        className="p-6 rounded-2xl tracking-[2px]"
                        type="password"
                        disabled={formLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="p-7 w-full rounded-4xl"
                disabled={formLoading}
              >
                {formLoading && <Loader2 className="animate-spin" />}
                {formLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
