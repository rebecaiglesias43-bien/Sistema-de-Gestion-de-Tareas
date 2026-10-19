import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRepository } from '../persistence/repositories/user.repository';
import { Usuario, UsuarioPublico } from '../types';
import { AuthenticationError, ConflictError } from '../errors';

/** Quita el hash antes de devolver el usuario al cliente. */
function toPublico(usuario: Usuario): UsuarioPublico {
  const { password: _password, ...publico } = usuario;
  return publico;
}

/** Coste de bcrypt. 10 es un buen equilibrio para desarrollo. */
const SALT_ROUNDS = 10;

/**
 * Registro y login.
 * Aquí viven el hash de contraseñas y la firma del token.
 */
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /** Crea el usuario si el correo no está tomado. */
  async registrar(nombre: string, email: string, password: string): Promise<UsuarioPublico> {
    const existente = await this.userRepository.findByEmail(email);
    if (existente) {
      throw new ConflictError('Ya existe un usuario con ese correo electrónico');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const usuario = await this.userRepository.create(nombre, email, passwordHash);
    return toPublico(usuario);
  }

  /** Comprueba credenciales y firma un JWT. */
  async iniciarSesion(email: string, password: string): Promise<{ token: string; usuario: UsuarioPublico }> {
    const usuario = await this.userRepository.findByEmail(email);
    if (!usuario) {
      throw new AuthenticationError('Credenciales inválidas');
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      throw new AuthenticationError('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      config.secretoJwt,
      { expiresIn: config.expiracionJwt as jwt.SignOptions['expiresIn'] },
    );

    return { token, usuario: toPublico(usuario) };
  }
}
