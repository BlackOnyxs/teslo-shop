import { NextResponse, type NextRequest } from 'next/server';
     
import { getToken } from 'next-auth/jwt';
 
export async function middleware(req: NextRequest) {
  
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const requestedPage = req.nextUrl.pathname;
  const validRoles = ['admin'];
  const url = req.nextUrl.clone();
  if ( !session ) {
    
    

    url.pathname = '/auth/login';
    url.search = `p=${ requestedPage }`;

    return NextResponse.redirect( url );
  }

  if ( requestedPage.startsWith('/admin' ) && !validRoles.includes( session.user.role ) ) {
    url.pathname = '/'
    return NextResponse.redirect( url );
  }

  if ( requestedPage.startsWith('/api/admin') && !validRoles.includes( session.user.role ) ){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  };


  return NextResponse.next();
}
 
export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*' ],
};