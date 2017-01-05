using System;
using System.Reflection;

using Ninject;
using KT.Data;

namespace KT.API
{
    public static class NinjectConfig
    {
        public static Lazy<IKernel> CreateKernel = new Lazy<IKernel>(() =>
        {
            StandardKernel kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());

            RegisterUnitOfWork(kernel);

            return kernel;
        });

        private static void RegisterUnitOfWork(KernelBase kernel)
        {
            kernel.Bind<IKTUnitOfWork>().To<KTMongoDBUnitOfWork>();
        }
    }
}