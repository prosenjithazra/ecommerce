import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../user/auth.guard';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  /** GET /wishlist — get the current user's wishlist */
  @UseGuards(AuthGuard)
  @Get()
  async getWishlist(@Request() req: RequestWithUser) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  /** POST /wishlist/toggle — add or remove a product (toggle) */
  @UseGuards(AuthGuard)
  @Post('toggle')
  async toggleItem(@Request() req: RequestWithUser, @Body() body: any) {
    return this.wishlistService.toggleItem(req.user.id, {
      productId: body.productId,
      name: body.name,
      price: body.price,
      originalPrice: body.originalPrice,
      image: body.image,
      category: body.category,
      rating: body.rating,
      reviewsCount: body.reviewsCount,
      inStock: body.inStock,
    });
  }

  /** DELETE /wishlist/item/:productId — remove one product explicitly */
  @UseGuards(AuthGuard)
  @Delete('item/:productId')
  async removeItem(
    @Request() req: RequestWithUser,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItem(req.user.id, productId);
  }

  /** DELETE /wishlist/clear — empty entire wishlist */
  @UseGuards(AuthGuard)
  @Delete('clear')
  async clearWishlist(@Request() req: RequestWithUser) {
    return this.wishlistService.clearWishlist(req.user.id);
  }
}
