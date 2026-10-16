import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRepository } from '../persistence/repositories/user.repository';
import { Usuario, UsuarioPublico } from '../types';
import { AuthenticationError, ConflictError } from '../errors';

/** Elimina el hash de la contraseña antes de exponer un usuario. */
function toPublico(usuario: Usuario): UsuarioPublico {
  const { password: _password, ...publico } = usuario;
  return publico;
}

/** Número de rondas de `salt` para bcrypt. */
const SALT_ROUNDS = 10;

/**
 * Servicio de autenticación.
 *
 * Contiene la lógica de negocio de registro e inicio de sesión: hasheo de
 * contraseñas con bcrypt y emisión de JSON Web Tokens.
 */
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /** Registra un nuevo usuario devolviendo sus datos públicos. */
  async registrar(nombre: string, email: string, password: string): Promise<UsuarioPublico> {
    const existente = await this.userRepository.findByEmail(email);
    if (existente) {
      throw new ConflictError('Ya existe un usuario con ese correo electrónico');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const usuario = await this.userRepository.create(nombre, email, passwordHash);
    return toPublico(usuario);
  }

  /** Verifica credenciales y devuelve un token JWT junto al usuario. */
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
