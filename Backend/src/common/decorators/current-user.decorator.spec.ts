import { CurrentUser } from './current-user.decorator';
import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

function getParamDecoratorFactory(decorator: Function) {
  class Test {
    public test(@decorator() value) {}
  }
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('CurrentUser Decorator', () => {
  it('should extract user from request', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: 'user-1' } }),
      }),
    } as ExecutionContext;

    const result = factory(null, mockContext);
    expect(result).toEqual({ id: 'user-1' });
  });

  it('should return undefined if no user', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    const result = factory(null, mockContext);
    expect(result).toBeUndefined();
  });
});
