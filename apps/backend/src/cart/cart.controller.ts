import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../user/auth.guard';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /** GET /cart — get the current user's cart */
  @UseGuards(AuthGuard)
  @Get()
  async getCart(@Request() req: RequestWithUser) {
    return this.cartService.getCart(req.user.id);
  }

  /** POST /cart/add — add a product or increase its quantity */
  @UseGuards(AuthGuard)
  @Post('add')
  async addItem(@Request() req: RequestWithUser, @Body() body: any) {
    return this.cartService.addItem(req.user.id, {
      productId: body.productId,
      name: body.name,
      image: body.image,
      price: body.price,
      quantity: body.quantity,
      size: body.size,
      color: body.color,
    });
  }

  /** PUT /cart/item/:productId — update quantity of one item */
  @UseGuards(AuthGuard)
  @Put('item/:productId')
  async updateItem(
    @Request() req: RequestWithUser,
    @Param('productId') productId: string,
    @Body() body: any,
  ) {
    return this.cartService.updateItemQuantity(
      req.user.id,
      productId,
      body.quantity,
    );
  }

  /** DELETE /cart/item/:productId — remove one item from cart */
  @UseGuards(AuthGuard)
  @Delete('item/:productId')
  async removeItem(
    @Request() req: RequestWithUser,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  /** DELETE /cart/clear — empty the entire cart */
  @UseGuards(AuthGuard)
  @Delete('clear')
  async clearCart(@Request() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.id);
  }
}
