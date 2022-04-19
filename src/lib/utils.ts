export function compose <A, B, C>( f1: (value: A) => B, f2: (value: B) => C ): (value: A) => C {
    return value => f2( f1( value ) )
}

export interface Functor<A> {
    map<B>( transform: (value: A) => B ): Functor<B>;
}

export interface Monad<A> {
    bind<B>( transform: (value: A) => Monad<B> ): Monad<B>;
}

export function clipToRange(val,low,high){
    Math.min(Math.max(val,low),high)
}


