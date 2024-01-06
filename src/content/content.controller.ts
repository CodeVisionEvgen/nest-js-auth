import { Controller, Get, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtTokenGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtTokenGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  SecureContent() {
    return 'Hello';
  }
}
