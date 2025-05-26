import { Button } from '@/components/ui/button';

const Login = () => {
  return (
    <div className="flex">
      <div></div>

      <div>
        {/* Card */}
        <div>
          <div>
            <h2>Iniciar Sesión</h2>
            <p>Bienvenido nuevamente! Por favor ingresar las credenciales.</p>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center min-h-svh">
              <Button>Click me</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
