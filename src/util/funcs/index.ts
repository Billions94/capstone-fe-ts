import { Form, FormAttribute } from '../../components/auth/interfaces';
import { Post, Token } from '../../redux/interfaces';
import { retrieveAccessToken } from '../../redux/store';

export function getFormAttributes<T>(input: T, forms: Form[]): FormAttribute[] {
  const attributes: FormAttribute[] = [];

  for (const [index, value] of Object.values(<any>input).entries()) {
    const attribute = {
      type: forms[index].type,
      name: forms[index].name,
      placeholder: forms[index].placeholder,
      value: String(value),
    };

    attributes.push(attribute);
  }

  return attributes;
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function useTokens(): Token {
  return (
    retrieveAccessToken() || {
      accessToken: localStorage.getItem('accessToken') ?? '',
      refreshToken: localStorage.getItem('refreshToken') ?? '',
    }
  );
}

export function getHoverState(elementId: string, state: boolean) {
  const node = document.getElementById(elementId);

  if (node)
    if (state) node.style.display = 'block';
    else node.style.display = 'none';
}

export function getIsUpdated(post: Post) {
  const isUpdated = (post?.createdAt as any) < (post?.updatedAt as any);
  return isUpdated;
}

export function getFileType(fileType: string) {
  return /heic|png|jpg|gif|pdf|jpeg/.exec(fileType.split('.').slice(-1).join());
}
